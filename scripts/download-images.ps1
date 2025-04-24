$images = @(
    @{name="placeholder-1.jpg"; width=800; height=600},
    @{name="placeholder-2.jpg"; width=800; height=600},
    @{name="placeholder-3.jpg"; width=800; height=600},
    @{name="avatar-1.jpg"; width=200; height=200},
    @{name="avatar-2.jpg"; width=200; height=200},
    @{name="avatar-3.jpg"; width=200; height=200}
)

foreach ($image in $images) {
    $url = "https://picsum.photos/$($image.width)/$($image.height)"
    $output = "public/images/$($image.name)"
    Invoke-WebRequest -Uri $url -OutFile $output
    Write-Host "Downloaded $($image.name)"
} 